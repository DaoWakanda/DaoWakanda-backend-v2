import { PageOptionsDto } from 'libs/dto/page.dto';
import { DIFFICULTY_LEVEL } from 'libs/enums/difficulty.enum';
import { Order } from 'libs/enums/order.enum';

/**
 * @description This function accepts a pagination query object and
 * makes sure no fields are empty. It adds default values to omitted fields.
 * @param pageOptionsDto The pagination query object.
 * @param defaults The default values to be used as fallback.
 * @returns {PageOptionsDto} A transformed pagination query object with no ommitted fields.
 */
export const createPageOptionFallBack = (
  pageOptionsDto: PageOptionsDto,
  defaults?: {
    order?: Order;
    page?: number;
    numOfItemsPerPage?: number;
    filterBy?: DIFFICULTY_LEVEL;
  },
) => {
  const order = pageOptionsDto.order || defaults?.order || Order.DESC;
  const page = pageOptionsDto.page || defaults?.page || 1;
  const numOfItemsPerPage =
    pageOptionsDto.numOfItemsPerPage || defaults?.numOfItemsPerPage || 10;
  const skip = (page - 1) * numOfItemsPerPage;
  const filterBy = pageOptionsDto.filterBy || defaults?.filterBy;

  const pageOptionsDtoFallBack: PageOptionsDto = {
    order,
    page,
    numOfItemsPerPage,
    skip,
    filterBy,
  };

  return pageOptionsDtoFallBack;
};
