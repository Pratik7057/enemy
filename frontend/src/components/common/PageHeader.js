import React from 'react';

const PageHeader = ({ title, description, actions }) => {
  return (    <div className="mb-8 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl">
          <span className="inline-block pb-1 border-b-2 border-primary-500 dark:border-primary-400">{title}</span>
        </h1>
        {description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>}
      </div>
      {actions && <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">{actions}</div>}
    </div>
  );
};

export default PageHeader;
