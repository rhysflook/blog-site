@extends('app')
@section('content')
  <form class="auth-form" method="POST" action="{{ route('login') }}">
    @csrf
    <div class="auth-outer flex centered">
      <div class="auth-area flex column centered">
        <div class="auth-grid">

          <div class="label1 centered">
            <label for="email">Email
            </label>
          </div>

          <div class="input1 centered">
            <input type="email" id="email" name="email">
          </div>

          <div class="label2 centered">
            <label for="password">Password
            </label>
          </div>

          <div class="input2 centered">
            <input type="password" class="input2 centered" id="password" name="password">
          </div>

        </div>
        @if (Route::has('password.request'))
          <a class="underline text-sm text-gray-600 hover:text-gray-900" href="{{ route('password.request') }}">
            {{ __('Forgot your password?') }}
          </a>
        @endif

        <button class="base-btn">
          {{ __('Log in') }}
        </button>
      </div>
    </div>

    <!-- Remember Me -->

  </form>
@endsection
