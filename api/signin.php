<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $loginInfo = json_decode(file_get_contents('php://input'));

        if (empty($loginInfo->email) || empty($loginInfo->password)) {
            $response = ["status" => 0, "message" => "Email and password are required"];
            echo json_encode($response);
            exit();
        }

        $sql = "SELECT ai.accountID, ai.userRole, ai.email, ai.password, si.shopID FROM account_info ai LEFT JOIN shop_info si ON ai.accountID = si.accountID WHERE ai.email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $loginInfo->email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $response = ["status" => 0, "message" => "Invalid email or password"];
            echo json_encode($response);
            exit();
        }

        if (password_verify($loginInfo->password, $user['password'])) {
            $response = ["status" => 1, "message" => "Login successful", "user" => $user];
        } else {
            $response = ["status" => 0, "message" => "Invalid email or password"];
        }

        echo json_encode($response);
        break;

    default:
        break;
}
?>