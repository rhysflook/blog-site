<?php

namespace App\Providers;

use App\Library\Practice;
// use App\Library\Practice;

use Illuminate\Support\ServiceProvider;

class PracticeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(Practice::class, function ($app) {
            return new Practice(3);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}