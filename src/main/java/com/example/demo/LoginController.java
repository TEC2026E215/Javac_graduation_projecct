//不要になった可能性あるけど一応残す
package com.example.demo;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @PostMapping("/api/login")
    public Map<String, Object> login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpServletRequest request) { // セッション管理のためにrequestを追加

        Map<String, Object> response = new HashMap<>();

        // 💡 実行するSQL文 
        // （※テーブル名やカラム名[user_id, password]は、実際のDBの設計に合わせて後で修正してください）
        String sql = "SELECT * FROM users WHERE user_id = ? AND password = ?";

        // ConnectDBを使ってAWSのRDSへ接続
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // SQLの「?」の部分に画面から送られてきたIDとPWを当てはめる
            pstmt.setString(1, username);
            pstmt.setString(2, password);

            // SQLを実行
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // ⭕ 一致するユーザーがDBに見つかった場合（ログイン成功）
                    response.put("success", true);
                    response.put("message", "ログインに成功しました！");

                    // 🔑 セッションを作成してログイン状態を記録する
                    HttpSession session = request.getSession(true);
                    session.setAttribute("loginUser", username);

                } else {
                    // ❌ ユーザーが見つからなかった場合（ログイン失敗）
                    response.put("success", false);
                    response.put("message", "ユーザーIDまたはパスワードが正しくありません。");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "データベースエラーが発生しました。");
        }

        return response;
    }
}

