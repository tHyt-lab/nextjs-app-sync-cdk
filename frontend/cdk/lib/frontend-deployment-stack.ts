import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class FrontEndDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todoBucket = new cdk.aws_s3.Bucket(this, 'TodoBucket', {
      websiteIndexDocument: 'index.html',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true
    })

    // cloudfront
    const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: 'website-distribution-originAccessIdentity'
    })

    const webSiteBucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [
        new cdk.aws_iam.CanonicalUserPrincipal(
          originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
        )
      ],
      resources: [`${todoBucket.bucketArn}/*`]
    })

    todoBucket.addToResourcePolicy(webSiteBucketPolicyStatement)

    const distribution = new cdk.aws_cloudfront.Distribution(this, 'distribution', {
      comment: 'website-distribution',
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          ttl: cdk.Duration.seconds(0),
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/'
        },
        {
          ttl: cdk.Duration.seconds(300),
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/error.html'
        }
      ],
      defaultBehavior: {
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cdk.aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new cdk.aws_cloudfront_origins.S3Origin(todoBucket, { originAccessIdentity })
      },
      priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_ALL
    })

    new cdk.aws_s3_deployment.BucketDeployment(this, 'TodoBucketDeployment', {
      sources: [cdk.aws_s3_deployment.Source.asset('../out')],
      destinationBucket: todoBucket,
      distribution: distribution,
      distributionPaths: ['/*']
    })

    new cdk.CfnOutput(this, 'TodoWebDestributionName', {
      value: distribution.distributionDomainName
    })
  }
}
