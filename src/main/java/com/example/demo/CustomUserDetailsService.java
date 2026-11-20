package com.example.demo;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 💡 実行するSQL文
        String sql = "SELECT user_id, user_password, user_role FROM users WHERE user_id = ?";

        try (Connection conn = ConnectDB.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // DBから取得した情報
                    String dbUser = rs.getString("user_id");
                    String dbPassword = rs.getString("user_password");
                    String dbRole = rs.getString("user_role");

                    // ロールが空の場合はデフォルトで "USER" にする
                    if (dbRole == null || dbRole.isEmpty()) {
                        dbRole = "USER";
                    }

                    // Spring Securityが扱えるユーザーオブジェクトに変換して返す
                    // （裏側でパスワードの一致検証が自動で行われます）
                    return User.withUsername(dbUser)
                            .password(dbPassword)
                            .roles("USER") // 権限を一般ユーザーに設定
                            .build();
                } else {
                    throw new UsernameNotFoundException("ユーザーが見つかりません: " + username);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new UsernameNotFoundException("データベースエラーが発生しました。", e);
        }
    }
}
