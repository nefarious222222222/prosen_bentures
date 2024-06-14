<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $reviewData = json_decode(file_get_contents('php://input'));

        if (isset($reviewData->productId) && isset($reviewData->accountId) && isset($reviewData->orderId) && isset($reviewData->rating) && isset($reviewData->feedback)) {
            $productId = $reviewData->productId;
            $accountId = $reviewData->accountId;
            $orderId = $reviewData->orderId;
            $rating = $reviewData->rating;
            $feedback = $reviewData->feedback;

            $existingReviewSql = "SELECT * FROM product_review WHERE orderID = :orderId";
            $existingStmt = $conn->prepare($existingReviewSql);
            $existingStmt->bindParam(':orderId', $orderId);
            $existingStmt->execute();
            $existingReview = $existingStmt->fetch(PDO::FETCH_ASSOC);

            if ($existingReview) {
                $response = ['status' => 0, 'message' => 'You have already reviewed this product'];
            } else {
                $sql = "INSERT INTO product_review (productID, accountID, orderID, rating, feedback) VALUES (:productId, :accountId, :orderId, :rating, :feedback)";
                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':productId', $productId);
                $stmt->bindParam(':accountId', $accountId);
                $stmt->bindParam(':orderId', $orderId);
                $stmt->bindParam(':rating', $rating);
                $stmt->bindParam(':feedback', $feedback);

                if ($stmt->execute()) {
                    $response = ['status' => 1, 'message' => 'Successfully reviewed this product'];
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to review this product'];
                }
            }
        } else {
            $response = ['status' => 0, 'message' => 'Something went wrong'];
        }
        echo json_encode($response);
        break;

    default:
        $response = ['status' => 0, 'message' => 'Invalid request method.'];
        echo json_encode($response);
        break;
}
?>