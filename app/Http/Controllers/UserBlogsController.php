<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserBlogsController extends Controller
{
    public function overview(Request $request)
    {
        if (Auth::check()) {
            $posts = auth()->user()->blogPosts;
            return view('create.overview', ['posts' => $posts]);
        } else {
            return view('auth.login');
        }
    }

    public function create(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:blog_posts'],
            'content' => ['required', 'string'],
        ]);

        $post = BlogPost::create([
            'title' => $request->title, 'content' => $request->content, 'user_id' => auth()->user()->id, "category" => 'test',
        ]);
        return redirect('creation');
    }

    public function update(Request $request)
    {
        $request->validate([
            'blogId' => ['required'],
            'title' => ['required', 'string', 'max:255', Rule::unique('blog_posts')->ignore($request->blogId)],
            'content' => ['required', 'string'],
        ]);
        BlogPost::find($request->blogId)->update(['title' => $request->title, 'content' => $request->content]);

        return view('create.overview', [
            'visibleBlog' => $request->blogId, 'editTitle' => $request->title,
            'editContent' => $request->content, 'posts' => auth()->user()->blogPosts,
        ]);

    }

    public function destroy($id)
    {
        BlogPost::find($id)->delete();
        return redirect('creation');

    }

    public function getPost($id)
    {
        $post = BlogPost::find($id);
        // $post->content = str_replace("<br />", "\r\n", $post->content);
        // str_replace("world","Peter","Hello world!")
        return json_encode($post);
    }
}