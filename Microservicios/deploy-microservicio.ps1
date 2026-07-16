<#
.SINOPSIS
    Despliega un unico microservicio de Pictorial Arcane a Azure Container Apps.

.DESCRIPCION
    Reconstruye la imagen Docker del microservicio seleccionado, la sube al Azure
    Container Registry (pictorialarcaneacr) y actualiza el Container App
    correspondiente para que arranque una nueva revision con esa imagen.

    El build/push se hace SIEMPRE en local (no con "az acr build"): ACR Tasks
    esta bloqueado en la suscripcion de Azure for Students usada por este
    proyecto (error TasksOperationsNotAllowed), asi que Docker Desktop debe
    estar corriendo en esta maquina.

    Este script solo cambia la IMAGEN del Container App. Las variables de
    entorno (Eureka, config-server, etc.) ya quedaron configuradas al crear
    cada Container App y no se tocan aqui.

.PARAMETER Servicio
    Nombre del microservicio a desplegar (opcional). Si se omite, se muestra
    un menu interactivo para elegirlo.

.PARAMETER Force
    Si se indica junto con -Servicio, salta la confirmacion "S/N".

.EJEMPLO
    .\deploy-microservicio.ps1
    Muestra el menu interactivo.

.EJEMPLO
    .\deploy-microservicio.ps1 -Servicio artwork-service -Force
    Despliega artwork-service directamente, sin menu ni confirmacion.
#>

param(
    [string]$Servicio,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# ==================== Configuracion ====================
$ResourceGroup  = "pictoial-arcane"
$AcrName        = "pictorialarcaneacr"
$AcrLoginServer = "$AcrName.azurecr.io"

# El script debe vivir dentro de Microservicios/, junto a los Dockerfiles.
$MicroservicesDir = $PSScriptRoot

$Servicios = @(
    [PSCustomObject]@{ Id = 1; Nombre = "service-registry";       Puerto = 8761; Descripcion = "Eureka - descubrimiento de servicios" },
    [PSCustomObject]@{ Id = 2; Nombre = "config-server";          Puerto = 8088; Descripcion = "Configuracion centralizada" },
    [PSCustomObject]@{ Id = 3; Nombre = "core-service";           Puerto = 8082; Descripcion = "Usuarios, ventas, auth (Postgres)" },
    [PSCustomObject]@{ Id = 4; Nombre = "artwork-service";        Puerto = 8070; Descripcion = "Catalogo de obras (MongoDB)" },
    [PSCustomObject]@{ Id = 5; Nombre = "audit-service";          Puerto = 8071; Descripcion = "Auditoria/facturacion (Cassandra)" },
    [PSCustomObject]@{ Id = 6; Nombre = "recommendation-service"; Puerto = 8072; Descripcion = "Recomendaciones (Neo4j + IA)" },
    [PSCustomObject]@{ Id = 7; Nombre = "api-gateway";            Puerto = 8060; Descripcion = "Gateway (unico expuesto a internet)" }
)

# ==================== Helpers de mensajes ====================
function Write-Titulo($texto) {
    Write-Host ""
    Write-Host ("=" * 72) -ForegroundColor Cyan
    Write-Host (" {0}" -f $texto) -ForegroundColor Cyan
    Write-Host ("=" * 72) -ForegroundColor Cyan
}
function Write-Ok($texto)   { Write-Host ("  [OK]    {0}" -f $texto) -ForegroundColor Green }
function Write-Info($texto) { Write-Host ("  [INFO]  {0}" -f $texto) -ForegroundColor Yellow }
function Write-Err($texto)  { Write-Host ("  [ERROR] {0}" -f $texto) -ForegroundColor Red }
function Write-Warn($texto) { Write-Host ("  [AVISO] {0}" -f $texto) -ForegroundColor DarkYellow

}

function Salir-ConError($texto) {
    Write-Err $texto
    Write-Host ""
    exit 1
}

# ==================== Verificaciones previas ====================
Write-Titulo "Verificando requisitos"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Salir-ConError "Docker no esta instalado o no esta en el PATH."
}
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Salir-ConError "Docker no esta corriendo. Abre Docker Desktop e intenta de nuevo."
}
Write-Ok "Docker Desktop esta corriendo"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Salir-ConError "Azure CLI (az) no esta instalado o no esta en el PATH."
}

$cuentaJson = az account show 2>$null
if ($LASTEXITCODE -ne 0 -or -not $cuentaJson) {
    Salir-ConError "No hay sesion activa de Azure CLI. Ejecuta 'az login' primero."
}
$cuenta = $cuentaJson | ConvertFrom-Json
Write-Ok ("Sesion de Azure activa: {0} (suscripcion: {1})" -f $cuenta.user.name, $cuenta.name)

az group show -n $ResourceGroup *> $null
if ($LASTEXITCODE -ne 0) {
    Salir-ConError ("No existe el resource group '{0}' o no tienes acceso a el." -f $ResourceGroup)
}
Write-Ok ("Resource group '{0}' encontrado" -f $ResourceGroup)

if (-not (Test-Path $MicroservicesDir)) {
    Salir-ConError ("No se encontro el directorio de microservicios: {0}" -f $MicroservicesDir)
}

# ==================== Seleccion del microservicio ====================
$servicioElegido = $null

if ($Servicio) {
    $servicioElegido = $Servicios | Where-Object { $_.Nombre -eq $Servicio }
    if (-not $servicioElegido) {
        Salir-ConError ("El servicio '{0}' no es valido. Opciones: {1}" -f $Servicio, ($Servicios.Nombre -join ", "))
    }
}
else {
    Write-Titulo "Selecciona el microservicio a desplegar"
    foreach ($s in $Servicios) {
        Write-Host ("  [{0}] {1,-24} puerto {2,-6} {3}" -f $s.Id, $s.Nombre, $s.Puerto, $s.Descripcion)
    }
    Write-Host "  [0] Cancelar"
    Write-Host ""

    $seleccion = Read-Host "Ingresa el numero del microservicio"

    if ($seleccion -eq "0") {
        Write-Info "Operacion cancelada por el usuario."
        exit 0
    }

    $idElegido = 0
    if (-not [int]::TryParse($seleccion, [ref]$idElegido)) {
        Salir-ConError ("Opcion invalida: '{0}'" -f $seleccion)
    }

    $servicioElegido = $Servicios | Where-Object { $_.Id -eq $idElegido }
    if (-not $servicioElegido) {
        Salir-ConError ("Opcion invalida: {0}" -f $seleccion)
    }
}

$nombre = $servicioElegido.Nombre
$dockerfile = Join-Path $MicroservicesDir ("{0}\Dockerfile" -f $nombre)

if (-not (Test-Path $dockerfile)) {
    Salir-ConError ("No se encontro el Dockerfile en: {0}" -f $dockerfile)
}

# ==================== Confirmacion ====================
Write-Titulo ("Vas a desplegar: {0}" -f $nombre)
Write-Host ("  Descripcion : {0}" -f $servicioElegido.Descripcion)
Write-Host ("  Puerto      : {0}" -f $servicioElegido.Puerto)
Write-Host ("  Resource grp: {0}" -f $ResourceGroup)
Write-Host ("  Registry    : {0}" -f $AcrLoginServer)
Write-Host ""
Write-Warn "Esto reconstruye la imagen, la sube a Azure y crea una nueva revision en produccion."

if (-not $Force) {
    $confirmacion = Read-Host "Continuar? (S/N)"
    if ($confirmacion -notmatch "^[sS]") {
        Write-Info "Operacion cancelada por el usuario."
        exit 0
    }
}

$inicio = Get-Date
$tag = Get-Date -Format "yyyyMMddHHmmss"
$imagenLocal  = "microservicios-{0}:{1}" -f $nombre, $tag
$imagenRemota = "{0}/{1}:{2}" -f $AcrLoginServer, $nombre, $tag

# ==================== 1. Build ====================
Write-Titulo ("PASO 1/4 - Construyendo imagen Docker de {0}" -f $nombre)
Write-Info ("Contexto de build: {0}" -f $MicroservicesDir)
Write-Info ("Tag: {0}" -f $tag)

Push-Location $MicroservicesDir
try {
    docker build -f ("{0}\Dockerfile" -f $nombre) -t $imagenLocal .
    if ($LASTEXITCODE -ne 0) { Salir-ConError "Fallo el 'docker build'. Revisa los mensajes anteriores." }
    Write-Ok ("Imagen construida localmente: {0}" -f $imagenLocal)

    docker tag $imagenLocal $imagenRemota
    if ($LASTEXITCODE -ne 0) { Salir-ConError "Fallo al etiquetar la imagen para ACR." }
    Write-Ok ("Imagen etiquetada como: {0}" -f $imagenRemota)

    # ==================== 2. Login ACR ====================
    Write-Titulo "PASO 2/4 - Autenticando con Azure Container Registry"
    az acr login --name $AcrName | Out-Null
    if ($LASTEXITCODE -ne 0) { Salir-ConError "Fallo el login en ACR ('az acr login')." }
    Write-Ok "Autenticacion con ACR exitosa"

    # ==================== 3. Push ====================
    Write-Titulo "PASO 3/4 - Subiendo imagen a ACR (puede tardar varios minutos)"
    docker push $imagenRemota
    if ($LASTEXITCODE -ne 0) { Salir-ConError "Fallo el 'docker push' hacia ACR." }
    Write-Ok ("Imagen subida: {0}" -f $imagenRemota)
}
finally {
    Pop-Location
}

# ==================== 4. Actualizar Container App ====================
Write-Titulo ("PASO 4/4 - Actualizando Container App '{0}' en Azure" -f $nombre)

az containerapp show --name $nombre --resource-group $ResourceGroup *> $null
if ($LASTEXITCODE -ne 0) {
    Salir-ConError ("No existe el Container App '{0}' en el resource group '{1}'. Este script solo actualiza apps ya creadas." -f $nombre, $ResourceGroup)
}

az containerapp update --name $nombre --resource-group $ResourceGroup --image $imagenRemota | Out-Null
if ($LASTEXITCODE -ne 0) { Salir-ConError "Fallo 'az containerapp update'. La app puede haber quedado en un estado intermedio; revisala en el portal de Azure." }
Write-Ok ("Container App '{0}' actualizado, nueva revision desplegandose" -f $nombre)

# ==================== Chequeo rapido post-deploy ====================
Write-Info "Esperando hasta 60s a que la nueva revision este activa..."
$activo = $false
for ($i = 0; $i -lt 12; $i++) {
    Start-Sleep -Seconds 5
    $estado = az containerapp show --name $nombre --resource-group $ResourceGroup --query "properties.runningStatus" -o tsv 2>$null
    if ($estado -eq "Running") { $activo = $true; break }
}

if ($activo) {
    Write-Ok "La nueva revision esta 'Running'"
}
else {
    Write-Warn "La app aun no reporta 'Running' despues de 60s. Puede seguir arrancando (los servicios Spring Boot tardan); no es necesariamente un error."
}

# ==================== Resumen final ====================
$duracion = (Get-Date) - $inicio
Write-Titulo "DESPLIEGUE COMPLETADO"
Write-Ok  ("Servicio desplegado : {0}" -f $nombre)
Write-Ok  ("Imagen              : {0}" -f $imagenRemota)
Write-Ok  ("Duracion total      : {0} min" -f [math]::Round($duracion.TotalMinutes, 1))
Write-Host ""
Write-Info ("Ver logs en vivo : az containerapp logs show -n {0} -g {1} --follow" -f $nombre, $ResourceGroup)
Write-Info ("Ver estado       : az containerapp show -n {0} -g {1} --query properties.runningStatus" -f $nombre, $ResourceGroup)
if ($nombre -eq "api-gateway") {
    Write-Info "Este es el servicio expuesto a internet; probalo desde tu frontend o con curl."
}
Write-Host ""
