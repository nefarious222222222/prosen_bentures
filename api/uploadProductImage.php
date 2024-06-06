<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$uploadDirectory = 'productImages/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
        $tempFile = $_FILES['productImage']['tmp_name'];
        $fileName = $_FILES['productImage']['name'];
        $fileType = $_FILES['productImage']['type'];

        $allowedTypes = array("image/jpeg", "image/png", "image/jpg");
        if (!in_array($fileType, $allowedTypes)) {
            $response = ['status' => 0, 'message' => 'Invalid file type. Only JPEG, PNG, and JPG files are allowed'];
            echo json_encode($response);
            exit;
        }

        if (move_uploaded_file($tempFile, $uploadDirectory . $fileName)) {
            $response = ['status' => 1, 'imagePath' => $uploadDirectory . $fileName];
            echo json_encode($response);
        } else {
            $response = ['status' => 0, 'message' => 'Failed to move uploaded file'];
            echo json_encode($response);
        }
    } else {
        $response = ['status' => 0, 'message' => 'No file uploaded'];
        echo json_encode($response);
    }
} else {
    $response = ['status' => 0, 'message' => 'Invalid request method'];
    echo json_encode($response);
}
?>