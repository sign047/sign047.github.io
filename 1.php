
<?php
	mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
	mysql_select_db(SAE_MYSQL_DB);
	$sql="SELECT * FROM email";
	$res=mysql_query($sql);
	while($row=mysql_fetch_assoc($res)){
		var_dump($row);
		echo $row['name']
	}
?>
