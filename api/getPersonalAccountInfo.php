<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $accountId = $_GET['accountId'];

        $sql = "SELECT a.*, pi.* FROM account_info a
        LEFT JOIN personal_info pi ON a.accountID = pi.accountID
        WHERE a.accountID = :accountId;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountId', $accountId);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData) {
            echo json_encode($userData);
        } else {
            $response = ["status" => 0, "message" => "The user does not have a profile set up yet"];
            echo json_encode($response);
        }
        break;
}
?>