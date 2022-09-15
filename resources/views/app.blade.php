<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/app.css">
  <script type="module" src="https://md-block.verou.me/md-block.js"></script>
  <title>Document</title>
</head>

<body>
  <div class="container">
    <nav class="nav-bar flex centered s-between">
      <div class="logo">PH</div>
      <div class="nav-items flex centered">
        <button class="nav-item base-btn">Home</button>
        <button class="nav-item base-btn">Read</button>
        <button class="nav-item base-btn"><a href="creation">Create</a></button>
        <button class="nav-item base-btn"><a
            href={{ Auth::guest() ? 'login' : 'logout' }}>{{ Auth::guest() ? 'Login' : 'Logout' }}</a></button>
      </div>
      <div class="search-area">Search</div>
    </nav>
    <div class="content-container">
      @yield('content')
    </div>

  </div>
  <script src="js/blogEdit.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</body>

</html>
