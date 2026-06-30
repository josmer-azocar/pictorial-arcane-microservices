package com.pictorial.recommendation_service.dto.request;

/**
 * DTO de entrada para sincronizar el alta de un comprador (endpoint sync/client -> SYNC.4).
 * Es el único sync que crea el nodo de catálogo (:Comprador), ya que representa el evento
 * de registro del cliente. Compra y vista, en cambio, exigen que el comprador ya exista.
 *
 * @param compradorId identificador del comprador (dniUser del cliente como String)
 * @param name        nombre completo del comprador
 * @param email       email del comprador
 */
public record ClientSyncRequestDto(
        String compradorId,
        String name,
        String email
) {}
