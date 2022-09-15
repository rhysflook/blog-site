@extends('app')
@section('content')
  <form class="auth-form" method="POST" action="{{ route('register') }}">
    @csrf

    <div class="auth-outer flex centered">
      <div class="auth-area flex column centered">
        <div class="auth-grid">
          <div class="label1 centered"><label for="name">Username</label></div>
          <div class="input1 centered"><input type="text" name="name"></div>
          <div class="label2 centered"><label for="email">Email</label></div>
          <div class="input2 centered"><input type="email" name="email"></div>
          <div class="label3 centered"><label for="password">Password</label></div>
          <div class="input3 centered"><input type="password" name="password"></div>
          <div class="label4 centered"><label for="confirm">Password confirm</label></div>
          <div class="input4 centered"><input type="password" name="password_confirmationfire"></div>
        </div>
        <a class="underline text-sm text-gray-600 hover:text-gray-900" href="{{ route('login') }}">
          {{ __('Already registered?') }}
        </a>

        <button class="base-btn">
          {{ __('Register') }}
        </button>
      </div>
    </div>
  </form>
@endsection
