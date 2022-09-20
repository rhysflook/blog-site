<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class ReadBlogController extends Controller
{
    public function getBlogs()
    {
        return view('read.index', ['posts' => BlogPost::all()]);
    }

    public function fetch($id)
    {
        $blog = BlogPost::find($id);
        $blog->times_read++;
        $blog->save();
        return view('read.blog', ['post' => $blog]);
    }

    public function find(Request $request)
    {
        $request->validate([
            'searchTitle' => ['required', 'string'],
        ]);
        $post = BlogPost::where('title', $request->searchTitle)->first();
        if (!$post) {
            return view('not-found');
        } else {
            return redirect()->route('read.blog', [$post]);
        }
    }
}