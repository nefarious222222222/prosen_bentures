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
        $sql = "SELECT a.accountID, a.email, a.phone, a.userRole, p.firstName, p.lastName FROM account_info AS a LEFT JOIN personal_info AS p ON a.accountID = p.accountID";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response = ["status" => 1, "data" => $users];
        } else {
            $response = ["status" => 0, "message" => "Failed to fetch users"];
        }
        echo json_encode($response);
        break;

    case 'POST':
        
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => 0, "message" => "Method not allowed"]);
        break;
}
?>