<?php 
	$name = $_POST["name"];
	$name = ($name ? $name : 'No name');
	$message = $_POST["message"];
	$email = $_POST["email"];

	require "PHPMailerAutoload.php";
	$mail = new PHPMailer();

	$mail->SMTPDebug = 3;

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = "smtp.gmail.com";  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = "hash.coding.edge@gmail.com";                 // SMTP username
	$mail->Password = "#trucoder";                           // SMTP password
	$mail->SMTPSecure = "ssl";                         // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 465;                                    // TCP port to connect to

	$mail->From = "hash.coding.edge@gmail.com";
	$mail->FromName = "$name";
	$mail->addAddress("hash.coding.edge@gmail.com", "Test User");     // Add a recipient

	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = "Contact Us Form";
	$mail->Body    = "Name: $name\n<br>Email: $email\n<br>Message: $message";
	$mail->AltBody = "This is the body in plain text for non-HTML mail clients";

	if(!$mail->send()) {
		echo 'Message could not be sent.';
		echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
	    echo 'Message has been sent';
	}
?>
