FROM php:8.0.1-fpm-buster

ENV PATH="./vendor/bin:${PATH}" \
    NGINX_SERVER_NAME="_" \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS="0" \
    PHP_OPCACHE_MAX_ACCELERATED_FILES="6000" \
    PHP_OPCACHE_MEMORY_CONSUMPTION="128"

# Arguments defined in docker-compose.yml
ARG USER_UID=33
ARG USER_GID=33

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
    libssl-dev \
    runit \
    nginx-light \
    supervisor \
    netcat \
    gnupg \
    apt-transport-https \
    wget

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install mongo
RUN pecl install mongodb
# Install PHP extensions
RUN docker-php-ext-install  mbstring exif pcntl bcmath gd

# Copy files
COPY docker/php/php-fpm.d/docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/php/conf.d/*.ini /usr/local/etc/php/conf.d/
COPY docker/php/php.ini /usr/local/etc/php/php.ini

COPY docker/nginx/h5bp /etc/nginx/h5bp

COPY docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker/supervisor/conf.d/*.conf /etc/supervisor/conf.d-available/

COPY docker/run-app.sh /usr/local/bin/run-app
COPY docker/changeowner.sh /usr/local/bin/changeowner
COPY docker/php/composer-installer.sh /usr/local/bin/composer-installer

ADD  https://github.com/kelseyhightower/confd/releases/download/v0.11.0/confd-0.11.0-linux-amd64 /usr/local/bin/confd
COPY docker/confd/conf.d/ /etc/confd/conf.d/
COPY docker/confd/templates/ /etc/confd/templates/

RUN chmod +x /usr/local/bin/confd \
    && chmod +x /usr/local/bin/run-app \
    && chmod +x /usr/local/bin/changeowner \
    && chmod +x /usr/local/bin/composer-installer \
    && /usr/local/bin/composer-installer \
    && mv composer.phar /usr/local/bin/composer \
    && chmod +x /usr/local/bin/composer \
    && composer --version

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www && /usr/local/bin/changeowner www-data $USER_UID $USER_GID

WORKDIR /var/www/html

RUN composer install  --prefer-dist

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/run-app"]







