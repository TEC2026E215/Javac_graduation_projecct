package com.example.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ConnectDB {
    // 接続に必要な情報
    private static final String PASSWORD = "Pasuwaado-1"; 
    private static final String URL = "jdbc:mysql://graduation-work.chaquiky4sjm.ap-southeast-2.rds.amazonaws.com:3306/gakusyu_db?useSSL=true&requireSSL=true&verifyServerCertificate=false";
    private static final String USER = "master"; 

    /**
     * データベースへの接続（Connection）を確立して返します。
     */
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC ドライバが見つかりません。");
            e.printStackTrace();
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

        /**
     * 💡 usersテーブルの実際の中身（データ）を確認するための使い捨てメソッド
     */
    public static void javaShowTables() {
        // usersテーブルから最新のデータを最大10件取得するSQL
        String sql = "SELECT * FROM users LIMIT 10";
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
             
            System.out.println("\n=================================");
            System.out.println("📄 usersテーブルの中身（実際のデータ）");
            System.out.println("=================================");
            
            // 列の数（カラム数）や名前を取得する
            java.sql.ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            
            boolean hasData = false;
            while (rs.next()) {
                hasData = true;
                System.out.println("--- 👤 ユーザーレコード ---");
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnName(i);
                    String value = rs.getString(i);
                    System.out.println("👉 " + columnName + " : " + value);
                }
            }
            
            if (!hasData) {
                System.out.println("⚠️ テーブルは存在しますが、データが1件も入っていません。");
            }
            System.out.println("=================================\n");
            
        } catch (Exception e) {
            System.err.println("❌ データ一覧の取得中にエラーが発生しました。");
            e.printStackTrace();
        }
    }


}


