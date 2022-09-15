<?php
namespace App\Library;

class Practice
{
    public function __construct($users)
    {
        $this->users = $users;
    }
    public function incrementUsers()
    {
        $this->users++;
    }
}