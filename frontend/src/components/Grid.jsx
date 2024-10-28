import React from 'react';
import { motion } from 'framer-motion';
import Image1 from '../assets/break.jpg';
import Image2 from '../assets/oven.jpg';
import Image3 from '../assets/unsplash.jpg';
import Image4 from '../assets/unsplash2.jpg';
import Image5 from '../assets/unsplash3.jpg';
import Image6 from '../assets/download.jfif';

const Grid = () => {
	return (
		<div className="container mx-auto p-4">
			<div className="text-2xl font-semibold md:mb-6 text-center py-4">
				<motion.h2
						initial={{ opacity: 0, y: 50 }}
						whileInView={{
							opacity: 1,
							y: 0,
							transition: { delay: 0.2, duration: 0.5 },
						}}
						viewport={{ once: false, amount: 0.5 }} className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					Our Products
				</motion.h2>
				<motion.p
						initial={{ opacity: 0, y: 50 }}
						whileInView={{
							opacity: 1,
							y: 0,
							transition: { delay: 0.4, duration: 0.5 },
						}}
						viewport={{ once: false, amount: 0.5 }} className="mt-1 mb-3 text-lg md:text-2xl text-green-900">
					Technologies to enrich your business
				</motion.p>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="grid gap-4">
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image3} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image1} alt="" />
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src={Image6}
							alt="Image6"
						/>
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src={Image5}
							alt="Image6"
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src={Image4}
							alt="Image6"
						/>
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
					<div>
						<img className="h-auto max-w-full rounded-lg" src={Image2} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Grid;
