package com.example.demo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 誰でもアクセスできるページ（トップ、部屋一覧、サインアップ画面、静的ファイルなど）
                .requestMatchers("/", "/html/login.html", "/html/sighup.html", "/css/**", "/signup.html", "/css/**", "/js/**").permitAll()
                // 口コミ投稿や部屋予約など、その他のリクエストはすべてログイン必須
                .anyRequest().authenticated()
            )
            .formLogin(login -> login
                // 自作のログイン画面（static内のlogin.html）を指定
                .loginPage("/html/login.html")
                // ログイン処理を実行するURL（Spring Securityが自動で処理するため、コントローラーの自作は不要）
                .loginProcessingUrl("/api/login")
                // ログイン成功時・失敗時の遷移先
                .defaultSuccessUrl("/html/main.html", true)
                .failureUrl("/login.html?error")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessUrl("/html/login.html")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // パスワードを安全にハッシュ化するエンコーダー
        return new BCryptPasswordEncoder();
    }
}

