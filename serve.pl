#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;
use MIME::Base64;
use File::Basename;

my $port = 3000;
my $root = dirname(__FILE__);

my %mime = (
    html => 'text/html; charset=utf-8',
    css  => 'text/css; charset=utf-8',
    js   => 'application/javascript; charset=utf-8',
    png  => 'image/png',
    jpg  => 'image/jpeg',
    jpeg => 'image/jpeg',
    gif  => 'image/gif',
    webp => 'image/webp',
    svg  => 'image/svg+xml',
    ico  => 'image/x-icon',
    json => 'application/json',
    woff2 => 'font/woff2',
    woff  => 'font/woff',
);

my $server = IO::Socket::INET->new(
    LocalPort => $port,
    Type      => SOCK_STREAM,
    Reuse     => 1,
    Listen    => 10,
) or die "Cannot bind to port $port: $!\n";

print "Serving $root on http://localhost:$port\n";

while (my $client = $server->accept()) {
    my $request = '';
    while (my $line = <$client>) {
        $request .= $line;
        last if $line eq "\r\n";
    }

    my ($method, $path) = $request =~ /^(\w+)\s+(\S+)/;
    $path //= '/';
    $path =~ s/\?.*//;
    $path =~ s/\.\.//g;
    $path = '/' if $path eq '';

    my $file = $root . $path;
    $file .= 'index.html' if $file =~ m{/$};

    if (-f $file) {
        my ($ext) = $file =~ /\.(\w+)$/;
        $ext = lc($ext // 'html');
        my $ct = $mime{$ext} // 'application/octet-stream';
        my $binary = ($ct =~ /^image|font/) ? 1 : 0;

        open(my $fh, $binary ? '<:raw' : '<:utf8', $file) or do {
            print $client "HTTP/1.1 500 Error\r\nContent-Length: 5\r\n\r\nError";
            close $client; next;
        };
        my $body = do { local $/; <$fh> };
        close $fh;

        my $len = do { use bytes; length($body) };
        print $client "HTTP/1.1 200 OK\r\nContent-Type: $ct\r\nContent-Length: $len\r\nConnection: close\r\n\r\n";
        print $client $body;
    } else {
        my $msg = "404 Not Found: $path";
        print $client "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: " . length($msg) . "\r\n\r\n$msg";
    }
    close $client;
}
