<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $shopData = json_decode(file_get_contents('php://input'));

        if (empty($shopData->accountID)) {
            $response = ["status" => 0, "message" => "Account ID cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($shopData->shopDocument)) {
            $response = ["status" => 0, "message" => "Shop document cannot be empty"];
            echo json_encode($response);
            exit();
        }

        $sql = "UPDATE shop_info SET shopDocument = :shopDocument WHERE accountID = :accountID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountID', $shopData->accountID);
        $stmt->bindParam(':shopDocument', $shopData->shopDocument);

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "File submition success, please wait for the admin to verify your file"];
        } else {
            $response = ["status" => 0, "message" => "Failed to submit file"];
        }
        break;

    default:
        $response = ["status" => 0, "message" => "Invalid request method"];
        break;
}

echo json_encode($response);
?>