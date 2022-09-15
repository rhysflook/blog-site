<?php

namespace App\Http\Controllers;

use App\Library\Practice;
use Illuminate\Support\Facades\App;

class PracticeController extends Controller
{

    public function __construct(Practice $practice)
    {
        $this->practice = $practice;
    }

    public function main()
    {
        echo $this->practice->users;
        $this->practice->incrementUsers();
        $this->second();
        return view('practice');
    }
    public function second()
    {
        $practice = App::make(Practice::class);
        echo $practice->users;
    }
}