# Base image
FROM public.ecr.aws/lambda/python:3.13

# Set workdir
WORKDIR /app

# Install system deps (needed for some libs)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


# copy dependencies file
COPY requirement.txt /tmp/requirement.txt
# Debug step: list files
RUN ls -l && cat requirement.txt
# Install dependencies
RUN pip install --no-cache-dir -r /tmp/requirement.txt -t "${LAMBDA_TASK_ROOT}"


# Copy the application code
COPY  . ${LAMBDA_TASK_ROOT}

# Set working directory to scripts
WORKDIR /app/scripts

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["app.main.handler"]