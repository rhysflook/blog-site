@extends('app')
@section('content')
  <div class="read-outer flex centered column">
    <h1 class="blog-title">{{ $post->title }}</h1>
    <div class="read-inner flex centered">
      <div class="blog-content" id="blogContent">
        {!! $post->content !!}
      </div>
    </div>
  </div>
@endsection
