# Use the official AWS Lambda Node.js 20 image as the base image for building
FROM public.ecr.aws/lambda/nodejs:20 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the container
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Run the build script defined in package.json (e.g., transpile TypeScript, bundle, etc.)
RUN npm run build

# Remove devDependencies to reduce final image size
RUN npm prune --production

# Start a new, clean image using the AWS Lambda Node.js 20 runtime
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory to Lambda's default task root
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy the built code (typically in /dist) from the build stage
COPY --from=build /app/dist ${LAMBDA_TASK_ROOT}

# Copy only production dependencies from the build stage
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# Copy package.json and lock file to the final image (useful for metadata or tooling)
COPY --from=build /app/package*.json ${LAMBDA_TASK_ROOT}

# Set the environment to production
ENV NODE_ENV=production

# Define the Lambda handler function to be executed (index.js's "handler" export)
CMD ["index.handler"]
