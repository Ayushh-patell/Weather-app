<?php
if (isset($_GET['submit'])) {
    $city_name = $_GET['city'];
    $conn = mysqli_connect("localhost", "root", "", "city_data");
    
    if(!$conn) {
        $response = array("success" => false, "message" => "Some error occured");
        echo json_encode($response);
        exit;
    }
    $sql = "SELECT city, lat, lng FROM `worldcities` WHERE city like '$city_name'"; 
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        $response = array("success" => false, "message" => "can't get a result");
        echo json_encode($response);
        exit;
    }
    
    if($result == null) {
        
        $response = array("success" => false, "message" => "No result found");
        echo json_encode($response);
        exit;
    }
    $data = mysqli_fetch_assoc($result);

    if($data == null) {
        $response = array("success" => false, "message" => "No result found");
        echo json_encode($response);
        exit;
    }

    echo json_encode($data);
    mysqli_close($conn);
}
?>