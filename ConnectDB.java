import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectDB {
    // 接続に必要な情報を定数として一元管理します
    private static final String PASSWORD = "Pasuwaado-1"; 
    private static final String URL = "jdbc:mysql://graduation-work.chaquiky4sjm.ap-southeast-2.rds.amazonaws.com:3306/gakusyu_db?useSSL=true&requireSSL=true&verifyServerCertificate=false";
    private static final String USER = "master"; // または master

    /**
     * データベースへの接続（Connection）を確立して返します。
     * 他のクラスからは「ConnectDB.getConnection()」で呼び出せます。
     */
    public static Connection getConnection() throws SQLException {
        try {
            // ドライバのロード
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC ドライバが見つかりません。");
            e.printStackTrace();
        }
        
        // 接続を確立して返す
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

