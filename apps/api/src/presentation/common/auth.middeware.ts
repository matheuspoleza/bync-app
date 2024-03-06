import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';
import { Tables } from 'src/infrastructure/database';
import { CustomerRepository } from 'src/infrastructure/repositories/customer.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const supabaseClient = new SupabaseClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
      );

      const response = await supabaseClient.auth.getUser(token);
      const userID = response.data.user.id;

      if (!userID) {
        throw new UnauthorizedException('Invalid token');
      }

      const { data } = await supabaseClient
        .schema('public')
        .from(CustomerRepository.TABLE_NAME)
        .select('*')
        .eq('user_id', userID)
        .single();

      const customersData = data as Tables<'customers'>;

      req.user = { userID };
      req.customerID = customersData.id;

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
