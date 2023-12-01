import { categoryMapper } from './categoryMapper';

const mockCtCategories = {
  id: 'root',
  name: {
    'es-CL': 'root',
  },
  slug: {
    'es-CL': 'root',
  },
  children: [
    {
      id: 'parent1',
      name: {
        'es-CL': 'category 1',
      },
      slug: {
        'es-CL': 'category-1',
      },
      ancestors: [{ id: 'root' }],
      children: [
        {
          id: 'child1.1',
          ancestors: [{ id: 'root' }, { id: 'parent1' }],
          name: {
            'es-CL': 'category 1.1',
          },
          slug: {
            'es-CL': 'category-1-1',
          },
          children: undefined,
        },
      ],
    },
    {
      id: 'parent2',
      ancestors: [{ id: 'root' }],
      name: {
        'es-CL': 'category 2',
      },
      slug: {
        'es-CL': 'category-2',
      },
      children: [
        {
          id: 'child2.1',
          ancestors: [{ id: 'root' }, { id: 'parent2' }],
          name: {
            'es-CL': 'category 2.1',
          },
          slug: {
            'es-CL': 'category-2-1',
          },
          children: undefined,
        },
        {
          id: 'child2.2',
          ancestors: [{ id: 'root' }, { id: 'parent2' }],
          name: {
            'es-CL': 'category 2.2',
          },
          slug: {
            'es-CL': 'category-2-2',
          },
          children: undefined,
        },
      ],
    },
    {
      id: 'parent3',
      ancestors: [{ id: 'root' }],
      name: {
        'es-CL': 'category 3',
      },
      slug: {
        'es-CL': 'category-3',
      },
      children: undefined,
    },
  ],
};
describe('categoryMapper', () => {
  it('should return a list of categories', () => {
    const categories = categoryMapper(mockCtCategories);

    expect(categories).toEqual([
      {
        title: 'Category 1',
        slug: 'category-1',
        children: [
          {
            title: 'Category 1.1',
            slug: 'category-1-1',
            children: undefined,
          },
          {
            title: 'Ver todo category 1',
            slug: 'category-1',
            children: undefined,
          },
        ],
      },
      {
        title: 'Category 2',
        slug: 'category-2',
        children: [
          {
            title: 'Category 2.1',
            slug: 'category-2-1',
            children: undefined,
          },
          {
            title: 'Category 2.2',
            slug: 'category-2-2',
            children: undefined,
          },
          {
            title: 'Ver todo category 2',
            slug: 'category-2',
            children: undefined,
          },
        ],
      },
      {
        title: 'Category 3',
        slug: 'category-3',
        children: undefined,
      },
    ]);
  });
});
