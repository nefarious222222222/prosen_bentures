<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $shopId = isset($_GET['shopId']) ? $_GET['shopId'] : '';

        if ($shopId) {
            $sqlSelect = "SELECT * FROM shop_performance WHERE shopId = :shopId";
            $stmtSelect = $conn->prepare($sqlSelect);
            $stmtSelect->bindParam(':shopId', $shopId);
            $stmtSelect->execute();
            $shopPerformance = $stmtSelect->fetch(PDO::FETCH_ASSOC);

            if ($shopPerformance) {
                echo json_encode($shopPerformance);
            } else {
                echo json_encode(["message" => "No performance data found for the given shopId"]);
            }
        } else {
            echo json_encode(["message" => "shopId is required"]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $shopId = isset($data['shopId']) ? $data['shopId'] : '';

        if ($shopId) {
            $sqlSelect = "SELECT * FROM shop_performance WHERE shopId = :shopId";
            $stmtSelect = $conn->prepare($sqlSelect);
            $stmtSelect->bindParam(':shopId', $shopId);
            $stmtSelect->execute();
            $currentPerformance = $stmtSelect->fetch(PDO::FETCH_ASSOC);

            if (!$currentPerformance) {
                $sqlInsert = "INSERT INTO shop_performance (shopId, totalRevenue, soldProducts, cancelledOrders) VALUES (:shopId, 0, 0, 0)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->bindParam(':shopId', $shopId);
                $stmtInsert->execute();
            }

            $totalRevenue = isset($data['totalRevenue']) ? ($currentPerformance['totalRevenue'] + $data['totalRevenue']) : $currentPerformance['totalRevenue'];
            $soldProducts = isset($data['soldProducts']) ? ($currentPerformance['soldProducts'] + $data['soldProducts']) : $currentPerformance['soldProducts'];
            $cancelledOrders = isset($data['cancelledOrders']) ? ($currentPerformance['cancelledOrders'] + $data['cancelledOrders']) : $currentPerformance['cancelledOrders'];

            $sqlUpdate = "UPDATE shop_performance SET
                        totalRevenue = :totalRevenue,
                        soldProducts = :soldProducts,
                        cancelledOrders = :cancelledOrders
                    WHERE shopId = :shopId";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':totalRevenue', $totalRevenue);
            $stmtUpdate->bindParam(':soldProducts', $soldProducts);
            $stmtUpdate->bindParam(':cancelledOrders', $cancelledOrders);
            $stmtUpdate->bindParam(':shopId', $shopId);

            if ($stmtUpdate->execute()) {
                echo json_encode(["message" => "Shop performance updated successfully"]);
            } else {
                echo json_encode(["message" => "Failed to update shop performance"]);
            }
        } else {
            echo json_encode(["message" => "shopId is required"]);
        }
        break;

}
?>