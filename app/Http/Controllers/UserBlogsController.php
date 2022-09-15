<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
    }

}