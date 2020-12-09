FROM php:8.0-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    autoconf \
    pkg-config \
    libssl-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install mongo
RUN pecl install mongodb

COPY docker/config/php/conf.d/*.ini  /usr/local/etc/php/conf.d/
RUN echo "extension=mongodb.so" >> /usr/local/etc/php/php.ini

# Install PHP extensions
RUN docker-php-ext-install  mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

RUN chown -R $user:$user  /var/www
# Set working directory
WORKDIR /var/www

USER $user





