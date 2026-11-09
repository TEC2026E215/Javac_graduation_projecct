package com.example.demo;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
// 💡 1. テストユーザー「testuser」のパスワード「password123」をハッシュ化する
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode("password123");

        // 💡 2. AWS RDSのusersテーブルに直接挿入するSQL
        String sql = "INSERT INTO users (user_id, user_password, user_name, user_role) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectDB.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, 100);       // 👤 ログインID
            pstmt.setString(2, hashedPassword);   // 🔑 ハッシュ化されたパスワード
            pstmt.setString(3, "テスト太郎");     // 📛 表示名
            pstmt.setString(4, "student");           // 🎖️ 権限ロール

            int rows = pstmt.executeUpdate();
            if (rows > 0) {
                System.out.println("\n=================================");
                System.out.println("🎉 テストユーザーの作成に成功しました！");
                System.out.println("ID: 100 / PW: password123");
                System.out.println("=================================\n");
            }

        } catch (Exception e) {
            System.out.println("\n⚠️ すでに存在するか、エラーが発生しました。");
            e.printStackTrace();
        }

        // 💡 3. ユーザー追加が終わったら、通常通りWebサーバーを起動する
        SpringApplication.run(DemoApplication.class, args);

		ConnectDB.javaShowTables();

}
}
