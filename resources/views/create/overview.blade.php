@extends('app')
@section('content')
  <div class="create-outer flex centered">
    <div class="create-menu flex">
      <div class="user-blogs">
        <h2 class="title flex centered">Posts</h2>
        <div class="post-list">
          @foreach ($posts as $post)
            <div class="post-row flex">
              <p>{{ $post->title }}</p>
              <button class="base-btn" id="editPost" onclick="loadBlogInEditor()">Edit</button>
            </div>
          @endforeach
        </div>
      </div>
      <form class="blog-post" method="post">
        @csrf
        <input type="text" name="title" value="{{ old('title', '') }}" id="title">
        <textarea name="content" id="" cols="30" rows="10" id="content">{{ old('content', '') }}</textarea>
        <input type="submit" value="Post" class="base-btn">
      </form>
    </div>
  </div>
@endsection
