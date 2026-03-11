package com.uneg.pictorialArcane;

import org.jspecify.annotations.Nullable;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing
@EnableScheduling
public class PictorialArcaneApplication {


	public static void main(String[] args) {
//		PasswordEncoder passwordEncoder = new PasswordEncoder() {
//			@Override
//			public @Nullable String encode(@Nullable CharSequence rawPassword) {
//				return "";
//			}
//
//			@Override
//			public boolean matches(@Nullable CharSequence rawPassword, @Nullable String encodedPassword) {
//				return false;
//			}
//		};
//
//		if (passwordEncoder.matches("bigote",
//				"$2a$10$dNuvZO.IHbsvlsr68XBiaOIOTIWnLUs6rf6bGJF2cYFqk9coWEQhC")) {
//
//			System.out.println("LA RESPUESTA 1 ES VERDADERA");
//		} else System.out.println("LA RESPUESTA 1 ES FALSE");
//
//		if (passwordEncoder.matches("roma",
//				"$2a$10$c0PELtkf36ytL/LK3p58F.6toIA/A0G0jIoDqG1hIFamYGzdHu.da")) {
//
//			System.out.println("LA RESPUESTA 2 ES VERDADERA");
//		} else System.out.println("LA RESPUESTA 2 ES FALSE");
//		if (passwordEncoder.matches("mar",
//				"$2a$10$skQGUzv1ABqY95EeIgKyXe5E2Vp3DMhY3W7RCHBxXh.u0ceVhtmC2")) {
//
//			System.out.println("LA RESPUESTA 3 ES VERDADERA");
//		}else System.out.println("LA RESPUESTA 3 ES FALSE");
		SpringApplication.run(PictorialArcaneApplication.class, args);
	}
}
