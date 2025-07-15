import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PointTransactionsService } from "./point-transactions.service";
import { PointTransactionDto } from "./dto/point-transaction.dto";
import { QueryPointTransactionDto } from "./dto/query-point-transaction.dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/auth/enums/role.enum";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";

// Define a type for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    UserID: number;
    Role: Role;
    BusinessID?: number;
  };
}

@ApiTags("Point Transactions")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("point-transactions")
export class PointTransactionsController {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService
  ) {}

  @Post()
  @Roles(Role.BusinessAdmin, Role.BusinessSubAdmin)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a point transaction (Earn/Redeem)",
    description:
      "Allows a Business Admin or Sub-Admin to record a point transaction for a member. The logic for calculating points earned or value redeemed is handled by the service based on active loyalty rules.",
  })
  @ApiResponse({
    status: 201,
    description: "The transaction has been successfully created.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request (e.g., insufficient points, invalid data).",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({
    status: 404,
    description: "Not Found (e.g., member or service not found).",
  })
  create(
    @Body() pointTransactionDto: PointTransactionDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.pointTransactionsService.createPointTransaction(
      pointTransactionDto,
      req.user
    );
  }

  @Get()
  @Roles(Role.BusinessAdmin)
  @ApiOperation({
    summary: "Get point transaction history for the business",
    description:
      "Retrieves a paginated and filterable list of all point transactions for the business admin's business.",
  })
  @ApiResponse({
    status: 200,
    description: "A paginated list of point transactions.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findAll(
    @Query() query: QueryPointTransactionDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.pointTransactionsService.findAll(query, req.user);
  }
}
