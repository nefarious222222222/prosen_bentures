<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT s.shopID, s.accountID, s.shopName, s.isVerified, s.status, 
                       p.firstName, p.lastName, s.shopDocument, a.email, a.phone, a.userRole
                FROM shop_info AS s 
                LEFT JOIN personal_info AS p ON s.accountID = p.accountID
                LEFT JOIN account_info AS a ON s.accountID = a.accountID";
        $stmt = $conn->prepare($sql);

        if ($stmt->execute()) {
            $shops = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response = ["status" => 1, "data" => $shops];
        } else {
            $response = ["status" => 0, "message" => "Failed to fetch shop information"];
        }

        echo json_encode($response);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $accountID = $data['accountID'];

        if (isset($accountID)) {
            $sql = "UPDATE shop_info SET isVerified = 1 WHERE accountID = :accountID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':accountID', $accountID);

            if ($stmt->execute()) {
                $response = ["status" => 1, "message" => "User verified successfully"];
            } else {
                $response = ["status" => 0, "message" => "Failed to verify user"];
            }
        } else {
            $response = ["status" => 0, "message" => "Invalid input"];
        }

        echo json_encode($response);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => 0, "message" => "Method not allowed"]);
        break;
}
?>