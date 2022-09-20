@extends('app')
@section('content')
  <div class="read-outer w-full flex centered">
    <div class="read-inner">
      @foreach ($posts as $post)
        <form action="read/{{ $post->id }}" method="get">
          <div class="read-post-row flex s-between">
            <button type="submit" class="base-btn">Read</button>
            <h2 class="post-title">{{ $post->title }}</h2>
            <p>{{ $post->user->name }}</p>
            <p class="read-count">Read {{ $post->times_read }} times</p>
          </div>
        </form>
      @endforeach
    </div>
  </div>
@endsection
