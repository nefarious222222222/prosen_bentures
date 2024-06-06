<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

$uploadDir = "shopVerificationFiles/";

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        if (empty($_FILES['shopDocument']['name'])) {
            $response = ["status" => 0, "message" => "Shop document cannot be empty"];
            echo json_encode($response);
            exit();
        }

        $fileName = $_FILES['shopDocument']['name'];
        $fileTmpName = $_FILES['shopDocument']['tmp_name'];
        $fileType = $_FILES['shopDocument']['type'];
        $fileError = $_FILES['shopDocument']['error'];
        $fileSize = $_FILES['shopDocument']['size'];

        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = array("pdf");

        if (!in_array($fileExt, $allowedExtensions)) {
            $response = ["status" => 0, "message" => "Only PDF files are allowed"];
            echo json_encode($response);
            exit();
        }

        if ($fileError !== 0) {
            $response = ["status" => 0, "message" => "An error occurred while uploading the file"];
            echo json_encode($response);
            exit();
        }

        if ($fileSize > 5000000) {
            $response = ["status" => 0, "message" => "File size is too large. Maximum file size allowed is 5MB"];
            echo json_encode($response);
            exit();
        }

        $uniqueFileName = uniqid('shop_document_') . '.' . $fileExt;
        $uploadFilePath = $uploadDir . $uniqueFileName;

        if (!move_uploaded_file($fileTmpName, $uploadFilePath)) {
            $response = ["status" => 0, "message" => "Failed to move uploaded file"];
            echo json_encode($response);
            exit();
        }

        $response = ["status" => 1, "message" => "File uploaded successfully", "filePath" => $uploadFilePath];
        break;

    default:
        $response = ["status" => 0, "message" => "Invalid request method"];
        break;
}

echo json_encode($response);
?>