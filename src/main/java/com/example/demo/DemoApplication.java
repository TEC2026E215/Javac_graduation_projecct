package com.example.demo;

import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
// 💡 1. テストユーザー「testuser」のパスワード「password123」をハッシュ化する
        // BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        // String hashedPassword = encoder.encode("password123");

        // // 💡 2. AWS RDSのusersテーブルに直接挿入するSQL
        // String sql = "INSERT INTO users (user_id, user_password, user_name, user_role) VALUES (?, ?, ?, ?)";

        // try (Connection conn = ConnectDB.getConnection();
        //     PreparedStatement pstmt = conn.prepareStatement(sql)) {

        //     pstmt.setInt(1, 100);       // 👤 ログインID
        //     pstmt.setString(2, hashedPassword);   // 🔑 ハッシュ化されたパスワード
        //     pstmt.setString(3, "テスト太郎");     // 📛 表示名
        //     pstmt.setString(4, "student");           // 🎖️ 権限ロール

        //     int rows = pstmt.executeUpdate();
        //     if (rows > 0) {
        //         System.out.println("\n=================================");
        //         System.out.println("🎉 テストユーザーの作成に成功しました！");
        //         System.out.println("ID: 100 / PW: password123");
        //         System.out.println("=================================\n");
        //     }

        // } catch (Exception e) {
        //     System.out.println("\n⚠️ すでに存在するか、エラーが発生しました。");
        //     e.printStackTrace();
        // }

        // 💡 3. ユーザー追加が終わったら、通常通りWebサーバーを起動する


        // // 💡 AWS RDSのテーブル構造を変更するSQL
        // String alterSql = "ALTER TABLE users ADD COLUMN login_id VARCHAR(50) UNIQUE AFTER user_id";
        // // 💡 既存のテストユーザー（100番）にログインIDを割り当てるSQL
        // String updateSql = "UPDATE users SET login_id = 'testuser' WHERE user_id = 100";

        // try (Connection conn = ConnectDB.getConnection();
        //      Statement stmt = conn.createStatement()) {

        //     // 1. 列を追加する命令を実行
        //     stmt.executeUpdate(alterSql);
        //     System.out.println("🎉 login_id 列の追加に成功しました！");

        //     // 2. テストユーザーにIDを設定する命令を実行
        //     stmt.executeUpdate(updateSql);
        //     System.out.println("🎉 テストユーザー（testuser）の更新に成功しました！");

        // } catch (Exception e) {
        //     System.out.println("⚠️ すでに追加済みか、エラーが発生しました。");
        //     e.printStackTrace();
        // }

        SpringApplication.run(DemoApplication.class, args);

		ConnectDB.javaShowTables();

}
}
