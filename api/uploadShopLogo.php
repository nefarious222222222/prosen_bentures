<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$uploadDirectory = 'shopLogo/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['shopImage']) && $_FILES['shopImage']['error'] === UPLOAD_ERR_OK) {
        $tempFile = $_FILES['shopImage']['tmp_name'];
        $fileName = basename($_FILES['shopImage']['name']);
        $fileType = $_FILES['shopImage']['type'];

        $allowedTypes = array("image/jpeg", "image/png", "image/jpg");
        if (!in_array($fileType, $allowedTypes)) {
            $response = ['status' => 0, 'message' => 'Invalid file type. Only JPEG, PNG, and JPG files are allowed'];
            echo json_encode($response);
            exit;
        }

        $fileName = uniqid() . '-' . $fileName;

        if (move_uploaded_file($tempFile, $uploadDirectory . $fileName)) {
            $response = ['status' => 1, 'imagePath' => $uploadDirectory . $fileName];
            echo json_encode($response);
        } else {
            $response = ['status' => 0, 'message' => 'Failed to move uploaded file'];
            echo json_encode($response);
        }
    } else {
        $response = ['status' => 0, 'message' => 'No file uploaded or upload error'];
        echo json_encode($response);
    }
} else {
    $response = ['status' => 0, 'message' => 'Invalid request method'];
    echo json_encode($response);
}
?>