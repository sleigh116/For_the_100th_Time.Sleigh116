import numpy as np
import random

# Define devices and their typical energy ranges
devices = {
    "fridge": (0.1, 0.3),
    "TV": (0.7, 1.0),
    "irrigation": (1.4, 1.8),
    "washing_machine": (0.5, 0.8),
    "microwave": (1.0, 1.3),
}

# Generate mock data
def generate_mock_data(num_samples=50):
    mock_data = []
    for _ in range(num_samples):
        device = random.choice(list(devices.keys()))
        energy_range = devices[device]
        energy_sequence = np.round(np.random.uniform(energy_range[0], energy_range[1], size=3), 2).tolist()
        mock_data.append({"sequence": energy_sequence, "device": device})
    return mock_data

# Save mock data to a file
def save_mock_data_to_file(mock_data, filename="mock_data.json"):
    import json
    with open(filename, "w") as f:
        json.dump(mock_data, f, indent=4)

if __name__ == "__main__":
    mock_data = generate_mock_data(50)
    save_mock_data_to_file(mock_data)
    print("Mock data generated and saved to mock_data.json") 