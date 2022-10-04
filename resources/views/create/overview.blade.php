@extends('app')
@section('content')
  @php($blogNum = isset($visibleBlog) ? $visibleBlog : null)
  @php($title = old('title', $blogNum ? $editTitle : ''))
  @php($content = old('title', $blogNum ? $editContent : ''))
  <template id="posts-template">
    <div class="post-list" id="userPostList">
      @foreach ($posts as $post)
        <div class="post-row flex s-between">
          <p>{{ $post->title }}</p>
          <button class="base-btn" name="userPost" id="{{ $post->id }}">Edit</button>
          <form action="creation/{{ $post->id }}" method="post">
            @csrf
            @method('DELETE')
            <input type="submit" value="Delete" class="base-btn">
          </form>
        </div>
      @endforeach
    </div>
  </template>
  <div class="create-outer flex centered">
    <div class="create-menu flex">
      <div class="user-blogs collapsed" id="postList">
        <div class="blog-list-top w-full s-between flex">
          <h2 class="flex centered posts-unfold">Posts</h2>
        </div>

      </div>
      <div id="controlBar" class="font-bar">
        <div id="headerControl" class="control" name="">
          <p>H</p>
        </div>
        <div id="boldControl" class="control" name="b">
          <p>B</p>
        </div>
        <div id="italicControl" class="control" name="em">
          <p>I</p>
        </div>
        <div id="underlineControl" class="control" name="u">
          <p>U</p>
        </div>
        <div id="strikeControl" class="control" name="s">
          <p>S</p>
        </div>
      </div>
      <form class="blog-post" method="post">
        <input type="hidden" name="_method" value="{{ $blogNum ? 'PUT' : 'POST' }}" id="method">
        @csrf
        <input type="text" name="title" value="{{ $title }}" id="title">
        <div contenteditable="true" class="content-area" name="content" id="content" cols="30" rows="10">

        </div>
        <div class="w-full flex s-between">
          <input type="submit" value="Post" class="base-btn">
          <input type="text" class="info-input" id="blog" name="blogId" value="{{ $blogNum }}" readonly>
        </div>
      </form>
    </div>
  </div>
  </div>
@endsection

@section('scripts')
  <script type="module" src="/js/create/index.js"></script>
@endsection
