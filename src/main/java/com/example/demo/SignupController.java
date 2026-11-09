package com.example.demo;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

@RestController
public class SignupController {

    // SecurityConfigで定義したPasswordEncoderを自動で読み込む
    private final PasswordEncoder passwordEncoder;

    public SignupController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/api/signup")
    public Map<String, Object> signup(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("name") String name) {

        Map<String, Object> response = new HashMap<>();

        // 💡 1. 画面から送られてきた生のパスワードをハッシュ化する
        // （例: "my_password" -> "$2a$10$eX7...")
        String hashedPassword = passwordEncoder.encode(password);

        // 💡 2. RDSにインサートするSQL文
        String sql = "INSERT INTO users (user_id, user_password, user_name, user_role) VALUES (?, ?, ?, ?)";

        // ConnectDBを使ってAWSのRDSへ接続・保存
        try (Connection conn = ConnectDB.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, hashedPassword); // ハッシュ化したパスワードを保存
            pstmt.setString(3, name);
            pstmt.setString(4, "USER");

            int rowsInserted = pstmt.executeUpdate();

            if (rowsInserted > 0) {
                response.put("success", true);
                response.put("message", "会員登録が完了しました！");
            } else {
                response.put("success", false);
                response.put("message", "登録に失敗しました。");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            // メールアドレスの重複などが起きた場合の簡易エラーメッセージ
            response.put("message", "データベースエラーが発生しました。既に登録されているIDの可能性があります。");
        }

        return response;
    }
}

