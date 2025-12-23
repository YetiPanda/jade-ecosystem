/**
 * Wholesale Application Resolver
 * Week 8: Practitioner Verification System
 *
 * GraphQL resolver for wholesale application operations
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Allow,
  Ctx,
  ID,
  Permission,
  RequestContext,
  ForbiddenError,
} from '@vendure/core';
import { WholesaleApplicationService } from '../services/wholesale-application.service';
import {
  WholesaleApplication,
  ApplicationStatus,
} from '../entities/wholesale-application.entity';

/**
 * Check if user has curator role
 */
function isCurator(ctx: RequestContext): boolean {
  return ctx.activeUserId !== undefined &&
         ctx.userHasPermissions([Permission.UpdateSettings]); // Using UpdateSettings as curator permission
}

/**
 * Wholesale Application Resolver
 */
@Resolver()
export class WholesaleApplicationResolver {
  constructor(
    private wholesaleApplicationService: WholesaleApplicationService
  ) {}

  /**
   * Get my wholesale application
   */
  @Query()
  @Allow(Permission.Authenticated)
  async myWholesaleApplication(
    @Ctx() ctx: RequestContext
  ): Promise<WholesaleApplication | null> {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new ForbiddenError();
    }

    const application = await this.wholesaleApplicationService.findByUserId(
      ctx,
      userId
    );

    return application || null;
  }

  /**
   * Get wholesale application by ID (curator only)
   */
  @Query()
  @Allow(Permission.Authenticated)
  async wholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID
  ): Promise<WholesaleApplication | null> {
    if (!isCurator(ctx)) {
      throw new ForbiddenError();
    }

    const application = await this.wholesaleApplicationService.findOne(ctx, id);
    return application || null;
  }

  /**
   * Get all wholesale applications (curator only)
   */
  @Query()
  @Allow(Permission.Authenticated)
  async wholesaleApplications(
    @Ctx() ctx: RequestContext,
    @Args('pagination') pagination?: any,
    @Args('filters') filters?: any
  ): Promise<{ items: WholesaleApplication[]; totalCount: number }> {
    if (!isCurator(ctx)) {
      throw new ForbiddenError();
    }

    const result = await this.wholesaleApplicationService.findAll(
      ctx,
      filters,
      pagination
    );

    return {
      items: result.items,
      totalCount: result.total,
    };
  }

  /**
   * Get pending applications count (curator only)
   */
  @Query()
  @Allow(Permission.Authenticated)
  async pendingApplicationsCount(@Ctx() ctx: RequestContext): Promise<number> {
    if (!isCurator(ctx)) {
      throw new ForbiddenError();
    }

    return this.wholesaleApplicationService.getPendingCount(ctx);
  }

  /**
   * Create wholesale application
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async createWholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('input') input: any
  ): Promise<{ application: WholesaleApplication; message: string }> {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new ForbiddenError();
    }

    const application = await this.wholesaleApplicationService.create(
      ctx,
      userId,
      input
    );

    return {
      application,
      message: 'Wholesale application created successfully',
    };
  }

  /**
   * Update wholesale application
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async updateWholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID,
    @Args('input') input: any
  ): Promise<WholesaleApplication> {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new ForbiddenError();
    }

    return this.wholesaleApplicationService.update(ctx, id, userId, input);
  }

  /**
   * Submit wholesale application for review
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async submitWholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID
  ): Promise<{ application: WholesaleApplication; message: string }> {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new ForbiddenError();
    }

    const application = await this.wholesaleApplicationService.submit(
      ctx,
      id,
      userId
    );

    return {
      application,
      message: 'Application submitted successfully and is under review',
    };
  }

  /**
   * Review wholesale application (curator only)
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async reviewWholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID,
    @Args('input') input: any
  ): Promise<{ application: WholesaleApplication; message: string }> {
    if (!isCurator(ctx)) {
      throw new ForbiddenError();
    }

    const curatorId = ctx.activeUserId;
    if (!curatorId) {
      throw new ForbiddenError();
    }

    const application = await this.wholesaleApplicationService.review(
      ctx,
      id,
      curatorId,
      input
    );

    let message = 'Application reviewed successfully';
    if (input.status === ApplicationStatus.APPROVED) {
      message = 'Application approved and wholesale account activated';
    } else if (input.status === ApplicationStatus.REJECTED) {
      message = 'Application rejected';
    }

    return {
      application,
      message,
    };
  }

  /**
   * Withdraw wholesale application
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async withdrawWholesaleApplication(
    @Ctx() ctx: RequestContext,
    @Args('id') id: ID
  ): Promise<WholesaleApplication> {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new ForbiddenError();
    }

    return this.wholesaleApplicationService.withdraw(ctx, id, userId);
  }

  /**
   * Request license verification (curator only)
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async requestLicenseVerification(
    @Ctx() ctx: RequestContext,
    @Args('applicationId') applicationId: ID
  ): Promise<WholesaleApplication> {
    if (!isCurator(ctx)) {
      throw new ForbiddenError();
    }

    return this.wholesaleApplicationService.requestLicenseVerification(
      ctx,
      applicationId
    );
  }
}
