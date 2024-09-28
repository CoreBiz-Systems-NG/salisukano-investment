/* eslint-disable react/prop-types */
import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

const DropDowns = ({ list, handleFilter }) => {
	const [selected, setSelected] = useState(list[0]);

	const handelChange = (e) => {
		setSelected(e);
		handleFilter(e);
	};

	return (
		<Listbox value={selected} onChange={handelChange}>
			<div className="relative mt-1">
				<Listbox.Button className="py-2.5 px-2 border border-[#E7E7E7] flex justify-center items-center gap-1 rounded text-sm text-[#637381] font-normal">
					<span className="block truncate">{selected.name}</span>{' '}
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="14" height="14" fill="white" />
						<path
							d="M11 5L7.5 8.5L4 5"
							stroke="#637381"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm min-w-[100px]">
						{list?.map((person, personIdx) => (
							<Listbox.Option
								key={personIdx}
								className={({ active }) =>
									`relative cursor-default select-none py-2 pl-2 pr-4 ${
										active ? 'bg-[#F6F8FA] text-gray-900' : 'text-gray-900'
									}`
								}
								value={person}
							>
								{({ selected }) => (
									<span
										className={`block truncate ${
											selected
												? 'font-medium text-[#212B36]'
												: 'font-normal text-[#637381]'
										}`}
									>
										{person.name}
									</span>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};

export default DropDowns;
