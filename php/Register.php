<?php 
    require "PHPMailerAutoload.php";
    $mail = new PHPMailer();

    $name = $_POST["name"];
    $name = ($name ? $name : 'No name');
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $experience = $_POST["experience"];
    $guard_name = $_POST["guard_name"];
    $guard_email = $_POST["guard_email"];
    $guard_phone = $_POST["guard_phone"];
    $friends = $_POST["friends"];
    $friends = ($friends ? $friends : 'No friends');

    $mail->SMTPDebug = 3;

    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = "smtp.gmail.com";  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = "coding.edge.smtp@gmail.com";                 // SMTP username
    $mail->Password = "sxqWkz9NFC";                           // SMTP password
    $mail->SMTPSecure = "ssl";                         // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                    // TCP port to connect to

    $mail->From = "coding.edge.smtp@gmail.com";
    $mail->FromName = "$name";
    $mail->addAddress("hash.coding.edge@gmail.com", "codingEdge Registration");     // Add a recipient

    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = "Student Registration";
    $body = "Student Information:\n<br>Name: $name\n<br>Email: $email\n<br>Phone: $phone\n<br>Past Experience: $experience\n<br>";
    $body .= "Guardian information:\n<br>Name: $guard_name\n<br>Email: $guard_email\n<br>Phone: $phone\n<br>";
    $body .= "Friends:\n<br>$friends\n<br>";
    $body .= "Class ID: Introduction To Java Programming";
    $mail->Body = $body;


    if(!$mail->send()) {
        http_response_code(500);
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        http_response_code(200);
        echo 'success';
    }
?>
