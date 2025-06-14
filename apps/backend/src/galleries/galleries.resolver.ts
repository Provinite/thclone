import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GalleriesService } from './galleries.service';
import { Gallery, GalleryConnection } from './entities/gallery.entity';
import {
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryFiltersInput,
  GalleryImageOperationInput,
  ReorderGalleriesInput,
} from './dto/gallery.dto';

@Resolver(() => Gallery)
export class GalleriesResolver {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Mutation(() => Gallery)
  @UseGuards(JwtAuthGuard)
  async createGallery(
    @Args('input') input: CreateGalleryInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.galleriesService.create(user.id, input);
  }

  @Query(() => GalleryConnection)
  async galleries(
    @Args('filters', { nullable: true }) filters?: GalleryFiltersInput,
    @CurrentUser() user?: any,
  ): Promise<any> {
    return this.galleriesService.findAll(filters, user?.id);
  }

  @Query(() => Gallery)
  async gallery(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user?: any,
  ): Promise<any> {
    return this.galleriesService.findOne(id, user?.id);
  }

  @Mutation(() => Gallery)
  @UseGuards(JwtAuthGuard)
  async updateGallery(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateGalleryInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.galleriesService.update(id, user.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteGallery(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.galleriesService.remove(id, user.id);
  }

  @Mutation(() => Gallery)
  @UseGuards(JwtAuthGuard)
  async addImageToGallery(
    @Args('galleryId', { type: () => ID }) galleryId: string,
    @Args('input') input: GalleryImageOperationInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.galleriesService.addImage(galleryId, input.imageId, user.id);
  }

  @Mutation(() => Gallery)
  @UseGuards(JwtAuthGuard)
  async removeImageFromGallery(
    @Args('galleryId', { type: () => ID }) galleryId: string,
    @Args('input') input: GalleryImageOperationInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.galleriesService.removeImage(galleryId, input.imageId, user.id);
  }

  @Mutation(() => [Gallery])
  @UseGuards(JwtAuthGuard)
  async reorderGalleries(
    @Args('input') input: ReorderGalleriesInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.galleriesService.reorderGalleries(user.id, input.galleryIds);
  }

  // Query for user's own galleries
  @Query(() => GalleryConnection)
  @UseGuards(JwtAuthGuard)
  async myGalleries(
    @CurrentUser() user: any,
    @Args('filters', { nullable: true }) filters?: GalleryFiltersInput,
  ): Promise<any> {
    const userFilters = { ...filters, ownerId: user.id };
    return this.galleriesService.findAll(userFilters, user.id);
  }

  // Query for galleries by specific user
  @Query(() => GalleryConnection)
  async userGalleries(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('filters', { nullable: true }) filters?: GalleryFiltersInput,
    @CurrentUser() user?: any,
  ): Promise<any> {
    const userFilters = { ...filters, ownerId: userId };
    return this.galleriesService.findAll(userFilters, user?.id);
  }

  // Query for galleries associated with a specific character
  @Query(() => GalleryConnection)
  async characterGalleries(
    @Args('characterId', { type: () => ID }) characterId: string,
    @Args('filters', { nullable: true }) filters?: GalleryFiltersInput,
    @CurrentUser() user?: any,
  ): Promise<any> {
    const characterFilters = { ...filters, characterId };
    return this.galleriesService.findAll(characterFilters, user?.id);
  }
}