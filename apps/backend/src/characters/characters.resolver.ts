import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CharactersService } from './characters.service';
import { Character as CharacterEntity, CharacterConnection } from './entities/character.entity';
import type { Character } from '@prisma/client';
import {
  CreateCharacterInput,
  UpdateCharacterInput,
  CharacterFiltersInput,
  TransferCharacterInput,
  ManageTagsInput,
} from './dto/character.dto';

@Resolver(() => CharacterEntity)
export class CharactersResolver {
  constructor(private readonly charactersService: CharactersService) {}

  @Mutation(() => CharacterEntity)
  @UseGuards(JwtAuthGuard)
  async createCharacter(
    @Args('input') input: CreateCharacterInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.charactersService.create(user.id, input);
  }

  @Query(() => CharacterConnection)
  async characters(
    @Args('filters', { nullable: true }) filters?: CharacterFiltersInput,
    @CurrentUser() user?: any,
  ): Promise<any> {
    return this.charactersService.findAll(filters, user?.id);
  }

  @Query(() => CharacterEntity)
  async character(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user?: any,
  ): Promise<any> {
    return this.charactersService.findOne(id, user?.id);
  }

  @Mutation(() => CharacterEntity)
  @UseGuards(JwtAuthGuard)
  async updateCharacter(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCharacterInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.charactersService.update(id, user.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCharacter(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.charactersService.remove(id, user.id);
  }

  @Mutation(() => CharacterEntity)
  @UseGuards(JwtAuthGuard)
  async transferCharacter(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: TransferCharacterInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.charactersService.transfer(id, user.id, input.newOwnerId);
  }

  @Mutation(() => CharacterEntity)
  @UseGuards(JwtAuthGuard)
  async addCharacterTags(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: ManageTagsInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.charactersService.addTags(id, user.id, input.tagNames);
  }

  @Mutation(() => CharacterEntity)
  @UseGuards(JwtAuthGuard)
  async removeCharacterTags(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: ManageTagsInput,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.charactersService.removeTags(id, user.id, input.tagNames);
  }

  // Query for user's own characters
  @Query(() => CharacterConnection)
  @UseGuards(JwtAuthGuard)
  async myCharacters(
    @CurrentUser() user: any,
    @Args('filters', { nullable: true }) filters?: CharacterFiltersInput,
  ): Promise<any> {
    const userFilters = { ...filters, ownerId: user.id };
    return this.charactersService.findAll(userFilters, user.id);
  }

  // Query for characters by specific user
  @Query(() => CharacterConnection)
  async userCharacters(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('filters', { nullable: true }) filters?: CharacterFiltersInput,
    @CurrentUser() user?: any,
  ): Promise<any> {
    const userFilters = { ...filters, ownerId: userId };
    return this.charactersService.findAll(userFilters, user?.id);
  }
}